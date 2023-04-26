import Swal from 'sweetalert2/dist/sweetalert2.all.js'

export const successfullyAlert = (title) => {
    Swal.fire({
        icon: 'success',
        title: title,
    })
}

export const warningAlert = (title) => {
    Swal.fire({
        icon: "warning",
        title: title,
    })
}

export const errorAlert = (title) => {
    Swal.fire({
        icon: "error",
        title: title,
    })
}

// show image
export const showImage = (imageUrlPath) => {
    Swal.fire({
        imageUrl: imageUrlPath,
        imageWidth: 1000,
        imageAlt: 'image',
    })
}