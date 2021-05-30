
export const formatOneResource = ({
    // Normalizing a single resource
        id,
        member,
        images 
    }) => {
    return {
        id,
        member,
        images: images.map(image => `http://127.0.0.1:8000${image.content}`)           
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
