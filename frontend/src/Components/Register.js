import React from 'react'
import { TextField, Button } from '@mui/material';

export default function Register() {
    return (
        <>
        <div className="container text-center">
            <div className='mt-3'>
                <TextField id="email" label="Email" type="email" name="email" variant='outlined' />
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
            <div className="mt-3">
                <Button variant="contained" > Register</Button>
            </div>
        </div>
        </>
    )
}
