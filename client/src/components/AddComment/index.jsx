import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {selectIsAuth} from "../../redux/slices/auth";

export const Index = () => {
    const userData = useSelector(state => state.auth.data)
    const {id} = useParams()
    const navigate = useNavigate()
    const isAuth = useSelector(selectIsAuth)

    const [isLoading, setIsLoading] = React.useState(false);
    const [text, setText] = React.useState('');
    const [postId, setPostId] = React.useState('');
    const [user, setUser] = React.useState('');

    const onSubmit = async () => {
        try {
            setPostId(id)
            setUser(userData._id)
            setIsLoading(true)

            const fields = {
                postId,
                text,
                user,
            }

            await axios.post(`/comments/${id}`, fields)
            navigate(`/posts/${id}`)
            const refresh = () => window.location.reload(true)
            refresh()

        }catch (err){
            console.warn(err)
            console.log("Error when creating the comment")
        }
    }

  return (
    <>
        {isAuth ?
            <div className={styles.root}>
                <Avatar
                    classes={{ root: styles.avatar }}
                    src={userData.imageUrl ? `http://localhost:4444/${userData.imageUrl}` : ''}
                />
                <div className={styles.form}>
                    <TextField
                        label="Написать комментарий"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        variant="outlined"
                        maxRows={10}
                        multiline
                        fullWidth
                    />
                    <Button onClick={onSubmit} variant="contained">Отправить</Button>
                </div>
            </div> : <div className={styles.root}>
                You need to be authorized to leave a comment
            </div>
        }
    </>
  )
};
