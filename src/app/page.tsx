import React from 'react'
import {  SignInButton, UserButton } from '@clerk/nextjs'
const page = () => {
  return (
    <>
      <SignInButton/>
      <UserButton/>
      </>
  )
}

export default page