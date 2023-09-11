import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { getAllPosts, getPostBySlug } from '../../api-lib/articles'
import markdownToHtml from '../../api-lib/articles/markdownToHtml'
import { ArticleType } from '../../api-lib/articles'
import { ShortUser } from '../../types'
import SeoHead from '../../components/SeoHead'

interface Props {
  pageProps: { post: ArticleType }
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug)
  const content = await markdownToHtml(post.content || '')

  const shortUserApi = `https://Fitness-sync.vercel.app/api/users/username?shortUser=${post.authorUsername}` || `http://localhost:3000/api/users/username?shortUser=${post.authorUsername}`
  const res = await fetch(shortUserApi)
  const author: ShortUser = await res.json()
  post.authorImgUrl = author.profileImgUrl

  return { props: { post: { ...post, content } } }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  }
}

const ArticleSlug: React.FC<Props> = ({
  pageProps: {
    post: { title, coverImg, dateCreated, lastUpdated, authorUsername, authorImgUrl, content, readTime, summary },
  },
}) => {
  const router = useRouter()

  return (
    <ArticleStyle>
      <SeoHead
        title={`${title} - FitSync`}
        description={summary || ''}
        openGraphProto={{
          currentURL: 'https://Fitness-sync.vercel.app' + router.asPath,
          previewImage: '/article-images/' + coverImg,
          siteName: 'FitSync',
          pageTitle: title,
          description: summary || '',
        }}
      />

      <Heading>
        <div className="author">
          <span>Author</span>
          {authorImgUrl && <img src={authorImgUrl} alt={authorUsername} height={20} width={20} />}
          <div>
            <p>{authorUsername}</p>
          </div>
        </div>

        <div className="cover-img">
          <Image src={'/article-images/' + coverImg} alt={`${title} cover image`} fill />
        </div>

        <div className="title">
          <h1 className="heading-gradient">{title}</h1>
          <p className="date">
            {dateCreated} ◦ {readTime} read
          </p>
        </div>
      </Heading>

      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
    </ArticleStyle>
  )
}

export default ArticleSlug

const Heading = styled.header`
  margin: 5rem auto 0;
  max-width: 900px;
  position: relative;

  .cover-img {
    width: 100%;
    max-width: 900px;
    aspect-ratio: 3.5 / 2;
    margin: auto;
    position: relative;

    img {
      max-width: 100%;
      border-radius: 5px;
      width: 100%;
      height: 100%;
      object-fit: cover !important;
    }
  }

  .title {
    left: 1rem;
    border-radius: 5px;
    padding: 2rem 0;
    text-align: left;

    h1 {
      font-size: 3.5rem;
    }
    .date {
      font-size: 0.8em;
      font-weight: 300;
      margin-left: 0.1rem;
    }
  }

  @media (max-width: 768px) {
    margin: 3.5rem auto 2rem;

    .title {
      padding: 0;
      margin-top: 1rem;

      h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      .date {
        font-size: 0.65em;
      }
    }
  }

  .author {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      margin-bottom: 1rem;
    }

    a {
      margin-right: 1rem;
      border-right: 2px solid ${({ theme }) => theme.defaultAccent};
      padding-right: 1rem;
    }

    span {
      border-right: 2px solid ${({ theme }) => theme.defaultAccent};
      padding-right: 1rem;
      font-size: 0.8rem;
      margin-right: 1rem;
      font-weight: 300;
    }
    img {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      overflow: hidden;
    }

    p {
      font-weight: 300;
      margin-left: 0.5rem;
    }
  }
`

export const ArticleStyle = styled.section`
  .content {
    text-align: left;
    max-width: 900px;
    margin: auto;
    text-align: justify;
    position: relative;

    nav {
      border: 1px solid ${({ theme }) => theme.border};
      background: ${({ theme }) => theme.lowOpacity};
      border-radius: 5px;
      width: fit-content;
      padding: 0.5rem 1rem 1rem 0.25rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 3rem 0.5rem 1rem 0;
      font-weight: 400;
    }

    h1 {
      margin: 1rem 0;
    }

    nav {
      font-size: 0.9em;
      margin-bottom: 2rem;
    }

    p {
      /* text-indent: 2em; */
      font-weight: 300;
      margin: 1rem 0;
      line-height: 1.75rem;
      letter-spacing: 0.03em;
      color: ${({ theme }) => (theme.type === 'dark' ? '#dddddd' : '#121212')};
    }

    strong {
      font-weight: 500;
    }

    hr {
      margin: 1rem auto 0;
      width: 90%;
      border-color: ${({ theme }) => theme.buttonLight};
    }

    ul,
    ol {
      padding-left: 1rem;
      margin-left: 0.5rem;

      li {
        color: ${({ theme }) => (theme.type === 'dark' ? '#dddddd' : '#121212')};
        letter-spacing: 1px;
        font-weight: 300;
        margin-top: 0.5rem;

        &::marker {
          margin: 0 1rem 0 1rem;
          font-weight: 300;
          color: ${({ theme }) => theme.defaultAccent};
        }
      }
    }
    ul {
      list-style: disc;
    }
    ol {
      list-style: upper-roman;
    }
    nav ol {
      list-style: none;
      margin-left: 0;
      padding-left: 0.5rem;
      text-align: left;
    }
    nav ol ol {
      padding-left: 1.25rem;
    }

    a {
      text-decoration: underline;
      text-decoration-color: ${({ theme }) => theme.defaultAccent};
      text-underline-offset: 3px;
    }

    img {
      border-radius: 5px;
      margin-left: -2rem;
      max-width: 100%;

      @media (min-width: 550px) {
        margin: auto;
      }
    }
  }
  @media (max-width: 1000px) {
    padding: 0.5rem 1rem;

    .content {
      font-size: 90%;
    }
  }
`
