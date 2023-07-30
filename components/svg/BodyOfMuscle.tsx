import React from "react";
import styled from "styled-components";
import { Exercise } from "../../types";

type Props = {
  selectedMuscleGroups?: [Exercise["muscleGroup"], { count: number; exerciseIds: string[] }][];
};

const BodyOfMuscle = ({ selectedMuscleGroups }: Props) => {
  const selectedMuscleGroupMap = Object.fromEntries(selectedMuscleGroups || []) as {
    [k in Exercise["muscleGroup"]]: {
      count: number;
      exerciseIds: string[];
    };
  };

  const mostGroupCount = Math.max(...(selectedMuscleGroups?.map((group) => group[1].count) || []));

  return (
    <SVG
      id="Body"
      className={`${selectedMuscleGroups?.length ?? "allow-hover"}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 277.49 495.07"
    >
      <g id="bodyFront" className="body-front">
        <path
          className="body-part"
          d="M139.93,62.88c9.1,0,21.78-16.27,21.78-31.86s-5.6-28.55-21.78-28.55-21.78,13-21.78,28.55S130.83,62.88,139.93,62.88Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className="body-part"
          d="M278.54,266.91l-9.63-16.41a0.9,0.9,0,0,1,0-.92l0.52-.45,1.93,1.51a4.36,4.36,0,0,0,5.53-.25l-6.17-8.16a19.27,19.27,0,0,0-5.28-4.8l-6.34-3.9a13.68,13.68,0,0,1-5.17-5.73L243.48,206a34.5,34.5,0,0,1-1.89-4.82l-4-12.91a60.26,60.26,0,0,0-12.75-22.54l-5.35-6c-0.17-5.09,0-18.7-9-31.71-1.59-8.26,3.32-31-13.31-40.43-5.14-2.91-24.29-5.2-24.29-5.2L162.11,75.7c-3.54-2.06-7.54-9.38-7.54-13.47V55.66c-4.63,5.8-10,9.22-14.64,9.22s-9.9-3.35-14.49-9v6.4c0,4.09-4,11.4-7.54,13.47l-10.77,6.78S88,84.77,82.83,87.68C66.2,97.09,71.1,119.85,69.52,128.11c-9,13-8.87,26.62-9,31.71l-5.35,6a60.26,60.26,0,0,0-12.75,22.54l-4,12.91A34.53,34.53,0,0,1,36.52,206L26.05,227.8a13.68,13.68,0,0,1-5.17,5.73l-6.34,3.9a19.27,19.27,0,0,0-5.28,4.8L3.1,250.39a4.36,4.36,0,0,0,5.53.25l1.93-1.51,0.52,0.45a0.9,0.9,0,0,1,0,.92L1.46,266.91A1.51,1.51,0,0,0,4,268.57L12.53,257a0.9,0.9,0,0,1,1.54.9L6.63,274.16a1.65,1.65,0,0,0,2.93,1.49l8.89-15.8a0.9,0.9,0,0,1,.88-0.45l0.28,0a0.9,0.9,0,0,1,.75,1.2l-5.86,15.88a2,2,0,0,0,3.68,1.44l7.1-17.22a0.9,0.9,0,0,1,1.1-.51h0a0.9,0.9,0,0,1,.62.93l-1.07,12.43A1.55,1.55,0,0,0,29,274l2.4-14.59,3.6-5.87a45.46,45.46,0,0,0,4.56-11.57l2-8.29,9.61-16.21c1.5-2.54,18.53-22.69,23.6-30.27s7.71-14.37,9.35-24.15c2.29-3.77,5.11-11.45,7-20.74v0.09c9.84,19.41,10.39,35,8.63,48.4C99,197.25,98.73,207,98.3,210.64c-0.58,4.94-.86,8.05-4.83,19.32-4.83,19.32-4.83,33.32-4.83,33.32S88.09,302,93.21,330.84c0.51,2.88,1.07,5.65,1.71,8.28a68.06,68.06,0,0,0,0,26.08L92.86,376a42.68,42.68,0,0,0-.74,8.83s0,15.32.4,20.42c0.71,10.48,3.9,39,5.63,52.47a23.49,23.49,0,0,1,.17,2.92,37.19,37.19,0,0,1-2.63,13.69,8.79,8.79,0,0,1-2.22,2.81L74,489.07a2.92,2.92,0,0,1-.72.39l-9.54,3.17a2.6,2.6,0,0,0-1.66,2.3v0.18a2.43,2.43,0,0,0,2.42,2.42H88.64c1.41,0,18.15-2.56,27.17-4a6.95,6.95,0,0,0,5.68-6.66,3.62,3.62,0,0,0-.7-1.86,17.36,17.36,0,0,1-3.17-9.13V439.57L122,415.09a86,86,0,0,0,.62-26.48l-2.11-16.17,1.56-3.68a62.58,62.58,0,0,0,4.66-18.48l2.11-22.35a71.82,71.82,0,0,1,1.13-7.52l4.84-23.57a79.47,79.47,0,0,0,1.64-16.09v-17l0.94-.52h5.2l0.94,0.52v17a79.47,79.47,0,0,0,1.64,16.09L150,320.42a71.82,71.82,0,0,1,1.13,7.52l2.11,22.35a62.59,62.59,0,0,0,4.66,18.48l1.56,3.68-2.11,16.17a86,86,0,0,0,.62,26.48l4.39,24.48v36.36a17.36,17.36,0,0,1-3.17,9.13,3.62,3.62,0,0,0-.7,1.86,6.95,6.95,0,0,0,5.68,6.66c9,1.4,25.76,4,27.17,4H215.5a2.43,2.43,0,0,0,2.42-2.42v-0.18a2.6,2.6,0,0,0-1.66-2.3l-9.54-3.17a2.93,2.93,0,0,1-.72-0.39l-19.46-11.89a8.8,8.8,0,0,1-2.22-2.81,37.19,37.19,0,0,1-2.63-13.69,23.44,23.44,0,0,1,.17-2.92c1.73-13.42,4.92-42,5.63-52.47,0.35-5.1.4-20.42,0.4-20.42a42.65,42.65,0,0,0-.74-8.83l-2.07-10.83a68.06,68.06,0,0,0,0-26.08c0.63-2.63,1.2-5.4,1.71-8.28,5.13-28.79,4.57-67.55,4.57-67.55s0-14-4.83-33.32c-4-11.27-4.24-14.38-4.83-19.32-0.43-3.61-.66-13.39-1.52-19.88-1.76-13.36-1.22-29,8.63-48.4v-0.1c1.93,9.29,4.76,17,7,20.74,1.64,9.78,4.08,16.57,9.15,24.15s22.29,27.73,23.8,30.27l9.61,16.21,2,8.29A45.46,45.46,0,0,0,245,253.51l3.6,5.87L251,274a1.55,1.55,0,0,0,3.08-.39L253,261.15a0.9,0.9,0,0,1,.62-0.93h0a0.9,0.9,0,0,1,1.1.51l7.1,17.22a2,2,0,0,0,2.33,1.16h0a2,2,0,0,0,1.35-2.59l-5.86-15.88a0.9,0.9,0,0,1,.75-1.2l0.28,0a0.9,0.9,0,0,1,.88.45l8.89,15.8a1.65,1.65,0,0,0,2.93-1.49l-7.44-16.29a0.9,0.9,0,0,1,1.54-.9l8.56,11.6A1.51,1.51,0,0,0,278.54,266.91Z"
          transform="translate(-1.25 -2.47)"
        ></path>
      </g>
      <g id="muscleChest" className="muscle-chest">
        <path
          className={`muscle ${selectedMuscleGroupMap["core"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["core"]?.count / mostGroupCount || 1 }}
          d="M110.57,141.22c-0.1,0-10.78,4.6-10.78,4.6a2.18,2.18,0,0,0-1.19,1.84l0,3.93a2.37,2.37,0,0,0,.12.66,78.82,78.82,0,0,1,4,38.91c-0.5,3.75-.79,8.79-1,12.85-0.13,2.23-.54,6.72-0.72,8.7a2.23,2.23,0,0,0,.65,1.67c4.52,4.05,28.08,24.76,28.08,24.76a0.92,0.92,0,0,0,1.63-.53c1.13-4.93,4.37-20.13,4.37-32.23,0-14.66,2-62.49,2-62.49l-0.22,0C136,143.79,119.89,143.13,110.57,141.22Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["core"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["core"]?.count / mostGroupCount || 1 }}
          d="M169.43,141.22c0.1,0,10.78,4.6,10.78,4.6a2.18,2.18,0,0,1,1.19,1.84l0,3.93a2.37,2.37,0,0,1-.12.66,78.82,78.82,0,0,0-4,38.91c0.5,3.75.79,8.79,1,12.85,0.13,2.23.54,6.72,0.72,8.7a2.23,2.23,0,0,1-.65,1.67c-4.52,4.05-28.08,24.76-28.08,24.76a0.92,0.92,0,0,1-1.63-.53c-1.13-4.93-4.37-20.13-4.37-32.23,0-14.66-2-62.49-2-62.49l0.22,0C144,143.79,160.11,143.13,169.43,141.22Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["upper back"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["upper back"]?.count / mostGroupCount || 1 }}
          d="M126.66,72.65a1,1,0,0,0-1.8-.19,17.61,17.61,0,0,1-5.37,5.78L113,83c-1.26.93-1,1.74,0.55,1.8l16,0.68a1,1,0,0,0,1-1.32Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["chest"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["chest"]?.count / mostGroupCount || 1 }}
          d="M130.57,88.55L110,87.67a2.16,2.16,0,0,0-1.92,1.19l-8.44,19.24a2.42,2.42,0,0,0-.11.32l-4,16.17a2.29,2.29,0,0,0,.27,1.59c1.66,2.51,7.46,10.46,15.4,12.09,7.45,1.52,19.68,2.25,24.54,2.49a2,2,0,0,0,2.09-2V111.51a2.41,2.41,0,0,0-.06-0.49l-5.32-21A2.13,2.13,0,0,0,130.57,88.55Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["upper back"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["upper back"]?.count / mostGroupCount || 1 }}
          d="M153.34,72.65a1,1,0,0,1,1.8-.19,17.61,17.61,0,0,0,5.37,5.78L167,83c1.26,0.93,1,1.74-.55,1.8l-16,.68a1,1,0,0,1-1-1.32Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["chest"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["chest"]?.count / mostGroupCount || 1 }}
          d="M149.43,88.55L170,87.67a2.16,2.16,0,0,1,1.92,1.19l8.44,19.24a2.42,2.42,0,0,1,.11.32l4,16.17a2.29,2.29,0,0,1-.27,1.59c-1.66,2.51-7.46,10.46-15.4,12.09-7.45,1.52-19.68,2.25-24.54,2.49a2,2,0,0,1-2.09-2V111.51a2.41,2.41,0,0,1,.06-0.49l5.32-21A2.13,2.13,0,0,1,149.43,88.55Z"
          transform="translate(-1.25 -2.47)"
        ></path>
      </g>
      <g id="muscleLegsFront" className="muscle-legs-front">
        <path
          className={`muscle ${selectedMuscleGroupMap["upper leg"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["upper leg"]?.count / mostGroupCount || 1 }}
          d="M104,332l-8.29-56.2a1.44,1.44,0,0,1,0-.39l7.5-41.8a1.32,1.32,0,0,0-.46-1.17l-4.24-3.2a1.13,1.13,0,0,0-1.86.57l-0.32.93,0,0.11a150.69,150.69,0,0,0-4.69,32.45c0,0.37-.44,35.15,3.84,62.79a1.41,1.41,0,0,0,.33.66L102,333C103.41,334.48,104.33,334,104,332Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["lower leg"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["lower leg"]?.count / mostGroupCount || 1 }}
          d="M95.8,376.6a39.93,39.93,0,0,0-.69,8.25c0,0.15.05,15.28,0.39,20.23,0.7,10.38,3.89,38.87,5.61,52.29,0.08,0.66.14,1.37,0.17,2.11a1,1,0,0,0,1.22.92l11-2.51a1.21,1.21,0,0,0,.91-1.41L98.16,376.56c-0.67-3.29-1.73-3.28-2.35,0v0Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["lower leg"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["lower leg"]?.count / mostGroupCount || 1 }}
          d="M117,383.23l-8.17,32.12a1.19,1.19,0,0,0,0,.46l4.7,21.42c0.62,2.84,1.51,2.81,2-.06l3.61-22.62a83,83,0,0,0,.6-25.56l-0.74-5.66C118.55,380.5,117.67,380.45,117,383.23Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["upper leg"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["upper leg"]?.count / mostGroupCount || 1 }}
          d="M104.5,246.1l-5.14,29.76a1.44,1.44,0,0,0,0,.38l9.29,62.24a1.21,1.21,0,0,0,1.35,1l6.58-.91a1.29,1.29,0,0,0,1-.94c1.17-5.43,7.62-36.35,6.05-48.71-1.4-11-12.62-34.51-16.88-43.16C105.86,243.95,104.85,244.1,104.5,246.1Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${
            (selectedMuscleGroupMap["upper leg"] || selectedMuscleGroupMap["hip"]) && "highlight"
          }`}
          style={{
            opacity:
              ((selectedMuscleGroupMap["upper leg"]?.count || 0) +
                (selectedMuscleGroupMap["hip"]?.count || 0)) /
                mostGroupCount || 1,
          }}
          d="M111.44,245.63l17.64,42c1.39,3.32,2.43,3.09,2.31-.51-0.24-7.14-.8-18.34-2.09-23.28-1.37-5.24-10.5-14.47-15.93-19.6C111.1,242.15,110.24,242.76,111.44,245.63Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["upper leg"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["upper leg"]?.count / mostGroupCount || 1 }}
          d="M176,332l8.29-56.2a1.44,1.44,0,0,0,0-.39l-7.5-41.8a1.32,1.32,0,0,1,.46-1.17l4.24-3.2a1.13,1.13,0,0,1,1.86.57l0.32,0.93,0,0.11a150.69,150.69,0,0,1,4.69,32.45c0,0.37.44,35.15-3.84,62.79a1.41,1.41,0,0,1-.33.66L178,333C176.59,334.48,175.67,334,176,332Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["lower leg"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["lower leg"]?.count / mostGroupCount || 1 }}
          d="M184.2,376.6a39.93,39.93,0,0,1,.69,8.25c0,0.15-.05,15.28-0.39,20.23-0.7,10.38-3.89,38.87-5.61,52.29-0.08.66-.14,1.37-0.17,2.11a1,1,0,0,1-1.22.92l-11-2.51a1.21,1.21,0,0,1-.91-1.41l16.22-79.92c0.67-3.29,1.73-3.28,2.35,0v0Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["lower leg"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["lower leg"]?.count / mostGroupCount || 1 }}
          d="M163,383.23l8.17,32.12a1.19,1.19,0,0,1,0,.46l-4.7,21.42c-0.62,2.84-1.51,2.81-2-.06l-3.61-22.62a83,83,0,0,1-.6-25.56l0.74-5.66C161.45,380.5,162.33,380.45,163,383.23Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["upper leg"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["upper leg"]?.count / mostGroupCount || 1 }}
          d="M175.5,246.1l5.14,29.76a1.44,1.44,0,0,1,0,.38l-9.29,62.24a1.21,1.21,0,0,1-1.35,1l-6.58-.91a1.29,1.29,0,0,1-1-.94c-1.17-5.43-7.62-36.35-6.05-48.71,1.4-11,12.62-34.51,16.88-43.16C174.14,243.95,175.15,244.1,175.5,246.1Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${
            (selectedMuscleGroupMap["upper leg"] || selectedMuscleGroupMap["hip"]) && "highlight"
          }`}
          style={{
            opacity:
              ((selectedMuscleGroupMap["upper leg"]?.count || 0) +
                (selectedMuscleGroupMap["hip"]?.count || 0)) /
                mostGroupCount || 1,
          }}
          d="M168.56,245.63l-17.64,42c-1.39,3.32-2.43,3.09-2.31-.51,0.24-7.14.8-18.34,2.09-23.28,1.37-5.24,10.5-14.47,15.93-19.6C168.9,242.15,169.76,242.76,168.56,245.63Z"
          transform="translate(-1.25 -2.47)"
        ></path>
      </g>
      <g id="muscleArmsFront" className="muscle-arms-front">
        <path
          className={`muscle ${selectedMuscleGroupMap["upper arm"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["upper arm"]?.count / mostGroupCount || 1 }}
          d="M72.34,129.3l-0.36.52c-8,11.53-8.33,23.42-8.48,29.13l0,0.55c0.52,3.27,1.76,5.68,4.22,5.68,5.51,0,13-5.18,15.14-6.76a2.32,2.32,0,0,0,.65-0.82,87.55,87.55,0,0,0,4.78-16l2.84-15.27a2.18,2.18,0,0,0-.81-2l-2.8-2a2.2,2.2,0,0,0-2.1-.13Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["shoulder"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["shoulder"]?.count / mostGroupCount || 1 }}
          d="M77.1,120.52l20.21-15.23a2.37,2.37,0,0,0,.63-0.79l7.36-16.78a1.2,1.2,0,0,0-1.18-1.82h-0.05c-7.22,1-16.88,2.76-19.76,4.39-8.4,4.76-10.57,13.61-11.16,21.94,0,0.05,0,.14,0,0.19a45.28,45.28,0,0,0,.78,6.84C74.24,121,75.66,121.6,77.1,120.52Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["forearm"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["forearm"]?.count / mostGroupCount || 1 }}
          d="M58.79,170.8a12.07,12.07,0,0,0-7.73,5.51,57.26,57.26,0,0,0-5.82,12.89l-4,12.91a37.6,37.6,0,0,1-2.05,5.24l-4.69,9.75a1.7,1.7,0,0,0,.39,2l6.78,6.14a1,1,0,0,0,1.53-.23l5.4-9.1c0.71-1.19,3.33-4.46,8.29-10.6,5.58-6.91,12.52-15.52,15.4-19.81a52.16,52.16,0,0,0,8.14-19.09Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["upper arm"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["upper arm"]?.count / mostGroupCount || 1 }}
          d="M207.66,129.3l0.36,0.52c8,11.53,8.33,23.42,8.48,29.13l0,0.55c-0.52,3.27-1.76,5.68-4.22,5.68-5.51,0-13-5.18-15.14-6.76a2.32,2.32,0,0,1-.65-0.82,87.55,87.55,0,0,1-4.78-16l-2.84-15.27a2.18,2.18,0,0,1,.81-2l2.8-2a2.2,2.2,0,0,1,2.1-.13Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["shoulder"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["shoulder"]?.count / mostGroupCount || 1 }}
          d="M202.9,120.52l-20.21-15.23a2.37,2.37,0,0,1-.63-0.79L174.7,87.71a1.2,1.2,0,0,1,1.18-1.82h0.05c7.22,1,16.88,2.76,19.76,4.39,8.4,4.76,10.57,13.61,11.16,21.94,0,0.05,0,.14,0,0.19a45.28,45.28,0,0,1-.78,6.84C205.76,121,204.34,121.6,202.9,120.52Z"
          transform="translate(-1.25 -2.47)"
        ></path>
        <path
          className={`muscle ${selectedMuscleGroupMap["forearm"] && "highlight"}`}
          style={{ opacity: selectedMuscleGroupMap["forearm"]?.count / mostGroupCount || 1 }}
          d="M221.21,170.8a12.07,12.07,0,0,1,7.73,5.51,57.26,57.26,0,0,1,5.82,12.89l4,12.91a37.6,37.6,0,0,0,2.05,5.24l4.69,9.75a1.7,1.7,0,0,1-.39,2l-6.78,6.14a1,1,0,0,1-1.53-.23l-5.4-9.1c-0.71-1.19-3.33-4.46-8.29-10.6-5.58-6.91-12.52-15.52-15.4-19.81a52.16,52.16,0,0,1-8.14-19.09Z"
          transform="translate(-1.25 -2.47)"
        ></path>
      </g>
    </SVG>
  );
};

export default BodyOfMuscle;

const SVG = styled.svg`
  padding: 1rem;
  border-radius: 10px;
  height: 100%;
  max-width: 300px;
  max-height: 500px;

  .body-part {
    fill: ${({ theme }) => theme.border};
  }

  .muscle {
    fill: ${({ theme }) => theme.buttonMed};
    transition: all 0.25s ease;
  }

  .highlight .muscle,
  .highlight.muscle {
    fill: ${({ theme }) => theme.accent};
  }

  &.allow-hover .muscle:hover {
    fill: ${({ theme }) => theme.accent};
  }
`;