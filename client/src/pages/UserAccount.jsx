import React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";


import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import {fetchPosts, fetchTags} from "../redux/slices/posts";
import {fetchAuthMe} from "../redux/slices/auth";
import {fetchComments} from "../redux/slices/comments";
import axios from "../axios";

export const UserAccount = () => {

    const dispatch = useDispatch()
    const userData = useSelector(state => state.auth.data)
    const {posts, tags, comments} = useSelector(state => state.posts)
    // console.log(userData.userData)

    const [data, setData] = React.useState()
    const [isLoading, setIsLoading] = React.useState(true)

    const isPostsLoading = posts.status === 'loading'
    const isTagsLoading = tags.status === 'loading'
    // const isCommentsLoading = comments.status === 'loading'

    React.useEffect(() => {
        dispatch(fetchPosts())
        dispatch((fetchTags()))
        dispatch((fetchComments()))
    },[])

    React.useEffect(() => {
        axios.get(`/comments`)
            .then(res => {
                setData(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.warn(err)
                alert('Error when retrieving the post')
            })
    }, [])


    return (
        <>
            <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
                        isPostsLoading ? (
                            <Post
                                key={index}
                                isLoading={true}
                            />) : (
                            <Post
                                id={obj._id}
                                title={obj.title}
                                imageUrl={obj.imageUrl ? `http://localhost:4444/${obj.imageUrl}`: ''}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={3}
                                tags={obj.tags}
                                isEditable={userData?._id === obj.user._id}
                            />
                        ),
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    <CommentsBlock
                        items={data}
                        isLoading={isLoading}
                    />
                </Grid>
            </Grid>
        </>
    );
};
