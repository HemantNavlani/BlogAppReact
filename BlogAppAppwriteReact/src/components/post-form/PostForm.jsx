import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import service from '../../appwrite/config'
import { Input, Button, RTE, Select } from '../index'

function PostForm({post}) {

    const {register,handleSubmit,watch,setValue,control,getValues} = useForm({
        defaultValues:{
            title: post?.title||"",
            slug : post?.$id || "",
            content : post?.content || "",
            status : post?.status || "active"
        }
    })
    const navigate = useNavigate()
    const userData = useState(state=>state.auth.userData)

    const submit = async(data)=>{
        if (post){
            const file = data.image[0] ? await service.uploadFile(data.image[0]) : null

            if (file) await service.deleteFile(post.featuredImage)

            const dbPost = await service.updatePost(post.$id,{
                ...data,
                featuredImage : file ? file.$id : undefined
            })

            if (dbPost) navigate(`/post/${dbPost.$id}`)
        }
        else{
            const file = service.uploadFile(data.image[0])

            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId

                const dbPost = service.createPost({...data,userId:userData.$id})

                if (dbPost) navigate(`/post/${dbPost.$id}`)
            }
        }

    }

    const slugTransform = useCallback((value)=>{
        if (value && typeof value ===String)
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-")
        return ""
    },[])


    useEffect(()=>{
        const subscription = watch((value,{name})=>{
            if (name=='title'){
                setValue("slug",slugTransform(value.title),{shouldValidate:true})
            }
        })
        return ()=>subscription.unsubscribe()
    },[watch,setValue,slugTransform])


    return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
        <div className="w-2/3 px-2">
            <Input
            label="Title "
            placeholder="Title"
            className="mb-4"
            {...register('title',{
                required:true
            })}
            />

            <Input
            label="Slug : "
            placeholder="Slug :"
            className="mb-4"
            {...register('slug',{
                required:true
            })}
            onInput={
                (e)=>{
                    setValue('slug',slugTransform(e.currenTarget.value),{shouldValidate:true})
                }
            }
            />

            <RTE
            name="Content" 
            label="content"
            control={control}
            defaultValue={getValues("content")}
            />
        </div>

        <div className="w-1/3 px-2">
            <Input
            className="mb-4"
            label="Featured Image :"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register('image',{
                required:!post
            })}
            />

            {post && (
            <div className='w-full mb-4'>
                <img src={service.getFilePreview(post.featuredImage)} className="rounded-lg" alt={post.title} />
            </div>
            )}

            <Select
            options={["active","inactive"]}
            label="Status"
            className="mb-4"
            {...register('status',{
                required:true
            })}
            />


            <Button
            type='submit'
            bgColor={post ? "bg-green-500" : undefined}
            className="w-full"
            >
                {post?"Update":"Submit"}
            </Button>


        </div>
    </form>
  )
}

export default PostForm