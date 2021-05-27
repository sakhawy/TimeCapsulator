import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { fetchCapsules } from '../store/capsulesSlice'
import {selectCapsules} from '../store/capsulesSlice'

function Dashboard() {

    const dispatch = useDispatch()

    const capsules = useSelector(selectCapsules)

    useEffect(() => {
        dispatch(fetchCapsules())
    }, [capsules])

    return (
        <div>
            HI FROM DASHBOARD!
        </div>
    )
}

export default Dashboard
