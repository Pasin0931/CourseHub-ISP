"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import {Loader} from "lucide-react"

export default function AuthSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      localStorage.setItem("access_token", token)
    //   alert("redicting")
      router.replace("/courses")
    } else {
      router.replace("/?error=missing_token")
    }
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin" />
    </div>
  )
}