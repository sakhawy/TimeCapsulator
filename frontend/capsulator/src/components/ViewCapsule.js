// This should be deleted after a cleanup :)

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { selectCapsules, selectCapsulesIds, selectCapsulesStatus } from '../store/capsulesSlice'
import { fetchCapsuleMembers, selectMembers, selectMembersIds, selectMembersStatus } from '../store/membersSlice'
import { selectProfile } from '../store/profileSlice'
import { fetchCapsuleResources, selectResources, selectResourcesIds, selectResourcesStatus } from '../store/resourcesSlice'
import {OtherMembers} from './EditCapsule'

function ViewCapsule() {
    const {id} = useParams()

    const members = useSelector(selectMembers)
    const membersIds = useSelector(selectMembersIds)
    const membersStatus = useSelector(selectMembersStatus)
    
    const resources = useSelector(selectResources)
    const resourcesIds = useSelector(selectResourcesIds) 
    const resourcesState = useSelector(selectResourcesStatus) 

    const capsules = useSelector(selectCapsules)
    const capsulesIds = useSelector(selectCapsulesIds)
    const capsulesStatus = useSelector(selectCapsulesStatus)

    const profile = useSelector(selectProfile)

    const memberCapsule = capsulesIds.filter(capsule => capsules[capsule].members.includes(parseInt(id)))
    const capsuleMembers = membersIds.filter(member => members[member].capsuleId === parseInt(memberCapsule[0]))
    const capsuleResources = resourcesIds.filter(resource => resources[resource])

    const dispatch = useDispatch()

    useEffect(() => {
        if (memberCapsule.length !== 0){
            // To make sure we're up to date
            dispatch(fetchCapsuleMembers({capsuleKey: capsules[memberCapsule[0]].key}))
            // Getting the resources
            dispatch(fetchCapsuleResources({capsuleKey:capsules[memberCapsule[0]].key})) 
        } 
    }, [memberCapsule[0]])

    return (
        <div className="bg-secondary h-full w-full flex items-center justify-center rounded-2xl p-6">
            {capsuleMembers.length > 0 && capsuleResources.length > 0 && <OtherMembers members={capsuleMembers.map(member => members[member])} resources={capsuleResources.map(resource => resources[resource])}/>}
        </div>
    )
}

export default ViewCapsule
