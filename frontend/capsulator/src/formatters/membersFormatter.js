export const formatOneMember = ({
    // Normalizing a single capsule
        id,
        user, 
        capsule, 
        resource,
        state, 
        status, 
        user_name, 
    }) => {
    return {
        id,
        userId: user, 
        capsuleId: capsule, 
        resourceId: resource,
        state, 
        status, 
        userName: user_name
    }
}

export const formatManyMembers = (members) => {
    // Normalizing many members

    let allMembers = []
    for (var i=0; i<members.length; i++){
        
        // Normalize the member 
        const member = formatOneMember(members[i])

        // Update the normalized lists
        allMembers.push(member)
    }
    return allMembers
}
