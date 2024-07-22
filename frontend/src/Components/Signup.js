import React from 'react'
import { TextField, Button , Link} from '@mui/material';

export default function Signup() {
    return (
        <>
        <div className="container text-center">
            <div className='mt-3'>
                <TextField id="email" label="Email" type="email" name="email" variant='outlined' />
            </div>
            <div className='mt-3'>
                <TextField id="username" label="User Name" type="text" name="username" variant='outlined' />
            </div>
            <div className='mt-3'>
                <TextField id="first_name" label="First Name" type="text" name="first_name" variant="outlined" />
            </div>
            <div className='mt-3'>
                <TextField id="last_name" label="Last Name" type="text" name="last_name" variant="outlined" />
            </div>
            <div className='mt-3'>
                <TextField id="password" label="Password" type="password" name="password" variant='outlined' />
            </div>
            <Link href="#">Already registerd? Sign-in</Link>
            <div className="mt-3">
                <Button variant="contained" >Sign-up</Button>
            </div>
        </div>
        </>
    )
}
