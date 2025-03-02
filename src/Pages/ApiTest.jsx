"use client"

import { useState, useEffect } from "react"

const API_URL = "https://graduation-main-0wwkv3.laravel.cloud/api/auth/register"

const ApiTest = () => {
  const [status, setStatus] = useState("جاري الاختبار...")

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "OPTIONS",
          headers: {
            Origin: window.location.origin,
          },
        })
        if (response.ok) {
          setStatus("تم الاتصال بنجاح بالخادم")
        } else {
          setStatus(`فشل الاتصال بالخادم. كود الحالة: ${response.status}`)
        }
      } catch (error) {
        setStatus(`خطأ في الاتصال: ${error.message}`)
      }
    }

    testApi()
  }, [])

  return (
    <div>
      <h2>اختبار الاتصال بـ API</h2>
      <p>{status}</p>
    </div>
  )
}

export default ApiTest

