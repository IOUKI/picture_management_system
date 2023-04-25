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

export const deleteImage = async (apiUrl, imageName) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then( async (result) => {
        if (result.isConfirmed) {
            const response = await fetch(apiUrl + `/images/${imageName}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.status === 204) {
                successfullyAlert('移除成功')
            }
        }
    })
}