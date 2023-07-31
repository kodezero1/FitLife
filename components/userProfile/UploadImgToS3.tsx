import React, { useState, useRef } from "react";
import S3 from "aws-sdk/clients/s3";
import styled from "styled-components";
import { useQueryClient, useMutation } from "react-query";
// Utils
import { saveProfileImgUrl, useUserDispatch, useUserState } from "../../store";

// AWS
const myBucket = new S3({
  params: { Bucket: process.env.NEXT_PUBLIC_AWS_PROFILE_IMG_BUCKET },
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  accessKeyId: String(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID),
  secretAccessKey: String(process.env.NEXT_PUBLIC_AWS_SECRET_KEY),
});

type File = {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: number;
};

interface Props {}

const UploadImgToS3: React.FC<Props> = ({}) => {
  const { user } = useUserState();
  const userDispatch = useUserDispatch();

  const savingCircle = useRef<SVGCircleElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [savingImg, setSavingImg] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const clearInput = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setSavingImg(false);
  };

  const handleFileInput = (e) => {
    const file: File | null = e.target.files[0];
    if (!file) return;

    const maxFileSize = 3000000;

    if (file.size > maxFileSize)
      return console.log(`File too large. This was ${file.size} Max file size is 3mb`);

    setSelectedFile(file);

    const url = URL.createObjectURL(file as unknown as Blob);

    setPreviewUrl(url);
  };

  const { mutate: mutateProfile } = (function (uploadedFileName) {
    const queryClient = useQueryClient();
    const profileImgUrl = `https://lift-club-profile-imgs.s3.us-west-1.amazonaws.com/${uploadedFileName}`;

    return useMutation(() => saveProfileImgUrl(userDispatch, user!._id, profileImgUrl), {
      onSuccess: () => queryClient.invalidateQueries(["user-profile", user?.username]),
    });
  })(uploadedFileName);

  const uploadFile = (file: File | null) => {
    if (!file) return console.log("Please upload a valid file");

    const fileType = file.type.split("/")[1];
    const fileName = user!.username + "." + fileType;

    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: "lift-club-profile-imgs",
      Key: fileName,
    };

    setUploadedFileName(fileName);
    setSavingImg(true);

    myBucket
      .putObject(params)
      .on("httpUploadProgress", async (e) => {
        if (savingCircle.current == null) return;

        const progressPct = Math.round((e.loaded / e.total) * 100);
        const circumference = 104 * Math.PI;

        savingCircle.current.style.strokeDasharray = `${circumference} ${circumference}`;
        savingCircle.current.style.strokeDashoffset = `${circumference}`;

        function setProgress(percent: number) {
          const offset = circumference - (percent / 100) * circumference;
          savingCircle!.current!.style.strokeDashoffset = String(offset);
        }

        if (progressPct < 101 && progressPct > -1) {
          setProgress(progressPct);
        }

        if (e.loaded >= e.total) {
          setSavingImg(false);
          mutateProfile();
        }
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  return (
    <Container>
      <h3 className="title">Change your profile image</h3>
      <Icon>
        {savingImg && (
          <SavingIndicator className="progress-ring" height="120" width="120">
            <circle
              ref={savingCircle}
              className="progress-ring__circle"
              strokeWidth="4"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
            />
          </SavingIndicator>
        )}

        <FileInput type="file" accept="image/*" onChange={handleFileInput} />

        {previewUrl ? (
          <PreviewImg src={previewUrl} alt="Uploaded Profile Image" />
        ) : (
          <PlusIcon>
            <span></span>
            <span></span>
          </PlusIcon>
        )}
      </Icon>

      <p className="info">Max image size 3MB</p>

      <div className="btn-container">
        <button onClick={() => uploadFile(selectedFile)} disabled={!selectedFile}>
          Save
        </button>
        <button onClick={clearInput} disabled={!selectedFile}>
          Clear
        </button>
      </div>
    </Container>
  );
};

export default UploadImgToS3;

const Icon = styled.div`
  position: relative;
  background: ${({ theme }) => theme.lowOpacity};
  border: 3px solid ${({ theme }) => theme.buttonMed};
  height: 100px;
  width: 100px;
  border-radius: 50%;
  margin-right: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
`;

const PreviewImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
`;

const FileInput = styled.input`
  height: 100%;
  width: 100%;
  opacity: 0;
  position: absolute;
  z-index: 9;
  cursor: pointer;
`;

const SavingIndicator = styled.svg`
  position: absolute;
  border-radius: 50%;

  .progress-ring__circle {
    stroke-dasharray: 0;
    transition: stroke-dashoffset 0.35s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    stroke: ${({ theme }) => theme.accent};
  }
`;

const PlusIcon = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  span {
    position: absolute;
    bottom: 0px;
    right: 0;
    left: 0;
    top: 0;
    margin: auto;
    display: block;
    height: 3px;
    width: 30px;
    background: ${({ theme }) => theme.textLight};
    border-radius: 7px;

    &:first-of-type {
      transform: rotate(90deg);
    }
  }
`;

const Container = styled.div`
  padding: 0.5rem 0.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 1.5rem;

  .info {
    width: fit-content;
    font-size: 75%;
    color: ${({ theme }) => theme.textLight};
    margin: 0.5rem;
  }

  .btn-container {
    display: flex;

    button {
      background: ${({ theme }) => theme.accent};
      color: ${({ theme }) => theme.accentText};
      border: 1px solid ${({ theme }) => theme.border};
      border-radius: 5px;
      padding: 0.25rem 1.5rem;

      font-size: 1rem;
      font-weight: 400;
      transition: all 0.3s ease;
      display: block;
      margin: 1rem 0.5rem;

      &:disabled {
        color: ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.lowOpacity};
      }
    }
  }
`;
