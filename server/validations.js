import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must be minimum 5 symbols').isLength({ min: 5 }),
]

export const registerValidation = [
    body('email', 'Invalid email').isEmail(),
    body('password', 'Password must be minimum 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Write your name').isLength({min: 3}),
    body('avatarUrl', 'Invalid URL to avatar').optional().isURL(),
]

export const postCreateValidation = [
    body('title', 'Type the title of the post').isLength({min: 3}).isString(),
    body('text', 'Type the text of the post').isLength({min: 10}).isString(),
    body('tags', 'Invalid format of tags (It must be array)').optional().isString(),
    body('imageUrl', 'Invalid URLto image').optional().isString(),
]
