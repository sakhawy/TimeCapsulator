
export const formatOneCapsule = ({
    // Normalizing a single capsule
        id,
        key, 
        name, 
        state, 
        is_public, 
        creation_date, 
        locking_date,
        unlocking_date,
        members
    }) => {
    return {
        capsule: {
            id,
            key, 
            name, 
            state, 
            isPublic: is_public, 
            creationDate: creation_date, 
            lockingDate: locking_date,
            unlockingDate: unlocking_date,
            members: members.map(member => member.id)
        },
        members: [...members]
            
    }
}

export const formatManyCapsules = (capsules) => {
    // Normalizing many capsules

    let allCapsules = []
    let allMembers = []
    for (var i=0; i<capsules.length; i++){
        
        // Normalize the capsule 
        const {capsule, members} = formatOneCapsule(capsules[i])

        // Update the normalized lists
        allCapsules.push(capsule)
        allMembers = [...allMembers, ...members]
    }
    return {capsules: allCapsules, members: allMembers}
}
