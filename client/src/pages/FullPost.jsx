import React from "react";
import {useParams} from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../redux/slices/auth";

export const FullPost = () => {
    const [data, setData] = React.useState()
    const [isLoading, setIsLoading] = React.useState(true)
    const [commentData, setCommentData] = React.useState()
    const [isCommentLoading, setIsCommentLoading] = React.useState(true)

    const {id} = useParams()

    React.useEffect(() => {
        axios.get(`/posts/${id}`)
            .then(res => {
                setData(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.warn(err)
                alert('Error when retrieving the post')
            })
    }, [])


    React.useEffect(() => {
        axios.get(`/comments/${id}`)
            .then(res => {
                setCommentData(res.data)
                setIsCommentLoading(false)
            })
            .catch((err) => {
                console.warn(err)
                alert('Error when retrieving comments')
            })
    }, [])

    if(isLoading){
        return <Post isLoading={isLoading} isFullPost/>
    }

    return (
    <>
      <Post
          id={data._id}
          title={data.title}
          imageUrl={data.imageUrl ? `http://localhost:4444/${data.imageUrl}` : ''}
          user={data.user}
          createdAt={data.createdAt}
          viewsCount={data.viewsCount}
          commentsCount={3}
          tags={data.tags}
        isFullPost>
          <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={commentData}
        isLoading={isCommentLoading}
      >
          <Index/>

      </CommentsBlock>
    </>
  );
};
