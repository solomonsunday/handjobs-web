import { Skeleton } from 'primereact/skeleton'
import React from 'react'

const ExperienceSkeleton = () => {
    return (
        <div>
            <Skeleton width="10rem" className="p-mb-2"></Skeleton>
            <Skeleton width="100%" height="50px"></Skeleton>
        </div>
    )
}

export default ExperienceSkeleton
