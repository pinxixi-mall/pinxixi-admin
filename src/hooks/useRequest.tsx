import { useEffect, useState } from "react"

interface RequestProps {
    fetchApi(params: any): any;
    params?: {};
    deps?: Array<any>;
}

const useRequest = (options: RequestProps) => {
    const { fetchApi, params, deps } = options
    const [loading, setLoading] = useState(false)
    const [res, setRes] = useState(null)
    

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const res = await fetchApi(params)
            setRes(res)
            setLoading(false)
        }
        fetch()
    }, deps)

    return [loading, res]
}

export default useRequest