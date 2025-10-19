"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, Loader2 } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Auto-start camera when component mounts
    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError("")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true

        const handleLoadedMetadata = () => {
          videoRef.current
            ?.play()
            .then(() => {
              setIsStreaming(true)
              setIsLoading(false)
            })
            .catch((err) => {
              console.error("[v0] Play error:", err)
              setError("Failed to start video playback")
              setIsLoading(false)
            })
        }

        videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata, { once: true })

        const timeoutId = setTimeout(() => {
          videoRef.current
            ?.play()
            .then(() => {
              setIsStreaming(true)
              setIsLoading(false)
            })
            .catch((err) => {
              console.error("[v0] Timeout play error:", err)
              setError("Failed to start video playback")
              setIsLoading(false)
            })
        }, 2000)

        return () => clearTimeout(timeoutId)
      }
    } catch (err) {
      console.error("[v0] Camera error:", err)
      const errorMessage =
        err instanceof DOMException
          ? err.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access."
            : "Unable to access camera. Please check permissions."
          : "Unable to access camera. Please check permissions."
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const context = canvasRef.current.getContext("2d")
    if (!context) return

    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight

    context.scale(-1, 1)
    context.drawImage(videoRef.current, -canvasRef.current.width, 0)

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob)
          stopCamera()
        }
      },
      "image/jpeg",
      0.95,
    )
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Capture Selfie</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-200">{error}</div>
        )}

        <div className="space-y-4">
          {!isStreaming ? (
            <Button
              onClick={startCamera}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Requesting Camera Access...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </>
              )}
            </Button>
          ) : (
            <>
              <div className="relative bg-black rounded-lg overflow-hidden w-full aspect-square">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
                <Button onClick={handleClose} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
