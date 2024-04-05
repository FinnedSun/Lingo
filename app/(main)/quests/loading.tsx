import { Loader2 } from "lucide-react"

const Loading = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        </div>
    )
}
export default Loading