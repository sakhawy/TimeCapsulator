
export const formatOneResource = ({
    // Normalizing a single resource
        id,
        member,
        message,
        images 
    }) => {
    return {
        id,
        memberId: member,
        message,
        images: images.map(image => `${image.content}`)           
    }
}

export const formatManyResources = (resources) => {
    // Normalizing many resources

    let allResource = []
    for (var i=0; i<resources.length; i++){
        
        // Normalize the resource 
        const resource = formatOneResource(resources[i])

        // Update the normalized lists
        allResource.push(resource)
    }
    return {resources: allResource}
}
