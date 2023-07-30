import Link from 'next/link'
import React, { useState } from 'react'
import styled from 'styled-components'
import { matchSorter } from 'match-sorter'
import dayjs from 'dayjs'

import { getAllPosts, ArticleType } from '../api-lib/articles'
import SeoHead from '../components/SeoHead'
import TextInput from '../components/Shared/TextInput'

interface Props {
  pageProps: { posts: ArticleType[] }
}

export async function getStaticProps({}) {
  const posts = getAllPosts()
  return { props: { posts: posts } }
}

const Articles: React.FC<Props> = ({ pageProps: { posts } }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const displayedPosts = matchSorter(
    posts.filter((post) => (selectedCategory ? post.categories?.includes(selectedCategory) : true)),
    searchTerm,
    {
      keys: ['title', 'authorUsername', 'readTime', 'summary', 'categories'],
      baseSort: (post1, post2) => (dayjs(post1.item.dateCreated).isAfter(dayjs(post2.item.dateCreated)) ? -1 : 1),
    }
  )

  return (
    <Container>
      <SeoHead
        title={'Lift Club Articles'}
        description="A collection of articles ranging from nutrition to mindset to lifting technique."
      />

      <PageHeading>
        <h1 className="heading-gradient">Articles</h1>
        <h2>A collection of articles ranging from lifting technique to nutrition to mindsets</h2>
      </PageHeading>

      <Control>
        <TextInput
          onChange={(val) => setSearchTerm(val)}
          inputName={'articles-search'}
          placeholder={'What would you like to read about?'}
        />

        <div className="categories">
          {[...new Set(posts.flatMap((post) => post.categories))].map(
            (category) =>
              category && (
                <button
                  onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                  key={category}
                  className={`${selectedCategory === category && 'selected'}`}
                >
                  {category}
                </button>
              )
          )}
        </div>
      </Control>

      <PostsContainer>
        {displayedPosts.map(({ title, dateCreated, coverImg, slug, summary, readTime }, i) => (
          <Link href={`/article/${slug}`} key={slug} className="inner-a-tag">
            <PostItem>
              <div className="image-wrap">
                <img src={'/article-images/' + coverImg} alt="cover image" className="cover-image" />
              </div>

              <div className="content">
                <h2 className="title">{title}</h2>
                <p className="summary">{summary}</p>
                <span className="info">
                  <span>{dateCreated}</span>
                  <span>{readTime} read</span>
                </span>
              </div>
            </PostItem>
          </Link>
        ))}
      </PostsContainer>
    </Container>
  )
}

export default Articles

const Container = styled.section`
  max-width: 900px;
  width: 100%;
  margin: auto;
  padding: 0 1rem;
`

export const PageHeading = styled.header`
  padding: 5rem 0 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-weight: 500;
    font-size: 3.5rem;
    margin-bottom: 0.5rem;

    @media (max-width: 550px) {
      font-size: 2.5rem;
      margin-bottom: 0.25rem;
    }
  }

  h2 {
    font-weight: 300;
    margin: 0 0.5rem;
    font-size: 1.1rem;

    @media (max-width: 550px) {
      font-size: 0.9rem;
    }
  }
`

const Control = styled.div`
  .TextInput {
    text-align: left;

    @media (min-width: 550px) {
      max-width: 50%;
      min-width: 300px;
    }
  }

  .categories {
    max-width: 100%;
    width: 100%;
    overflow: auto;
    display: flex;
    align-items: center;
    padding: 0.5rem 0 0.25rem;

    button {
      font-size: 0.85rem;
      margin: 0 0.25rem;
      padding: 0.25rem 0.75rem;
      border-radius: 5px;
      background: ${({ theme }) => theme.medOpacity};
      border: 1px solid ${({ theme }) => theme.border};

      &.selected {
        border: 1px solid ${({ theme }) => theme.defaultAccent};
      }
    }
  }
`

const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  max-width: 900px;
  padding: 1rem 0;
  margin: auto;

  .inner-a-tag {
    margin: 1rem 0;
    border-radius: 10px;
    display: block;
  }
`

const PostItem = styled.div`
  cursor: pointer;
  width: 100%;

  overflow: hidden;
  border-radius: 10px;
  position: relative;
  background: ${({ theme }) => theme.lowOpacity};
  border: 1px solid ${({ theme }) => theme.border};
  min-height: max-content;
  transition: all 0.25s ease;

  &:hover {
    box-shadow: 0 3px 6px 1px ${({ theme }) => theme.boxShadow};
    img {
      filter: grayscale(0) !important;
    }
  }

  @media (min-width: 550px) {
    display: flex;
    height: 170px;
  }

  .image-wrap {
    width: 100%;
    height: 170px;
    aspect-ratio: 2 / 1;
    position: relative;

    img {
      max-height: 100%;
      max-width: 100%;
      height: 100%;
      width: 100%;
      object-fit: cover;
      filter: grayscale(0.5);
      transition: all 0.25s ease;
    }

    @media (min-width: 550px) {
      float: left;
      width: 30%;
      height: unset;
      min-height: 100%;
      clip-path: polygon(0% 0%, 95% 0%, 100% 100%, 0% 100%);
    }
  }

  .content {
    border-radius: 10px;
    z-index: 2;

    padding: 0.5rem 0.75rem;
    min-height: max-content;
    text-align: left;
    flex: 1;
    display: flex;
    flex-direction: column;

    @media (min-width: 550px) {
      padding: 0.5rem 1rem 0.5rem 2rem;
      margin-top: 0;
      border-radius: 0 10px 10px 0;
    }

    h2 {
      font-weight: 300;
      width: fit-content;
      font-size: 1.3rem;

      @media (min-width: 550px) {
        margin-left: -1rem;
      }
      @media (min-width: 750px) {
        font-size: 1.75rem;
      }
    }

    p {
      flex-grow: 1;
      font-size: 0.8rem;
      margin: 0.8rem 0;
      font-weight: 300;
      color: ${({ theme }) => theme.textLight};

      @media (min-width: 550px) {
        margin: 0.5rem 0;
        margin-left: -0.5rem;
      }
    }

    .info {
      color: ${({ theme }) => theme.textLight};
      font-weight: 300;
      font-size: 0.7rem;
      display: flex;
      justify-content: space-between;
    }
  }
`
