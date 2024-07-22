import React from 'react';
import {TextField,Button, Link} from '@mui/material';

export default function Login() {
    return (
        <>
            <div className="container text-center">
                <div className='mt-3'>
                    <TextField id="username" label="User Name" type="text" name="username" variant='outlined' />
                </div>
                <div className='mt-3'>
                    <TextField id="password" label="Password" type="password" name="password" variant='outlined' />
                </div>
                <Link href="#">Not registerd yet? Sign-up </Link>
                <div className="mt-3">
                    <Button variant="contained" > Sign-in </Button>
                </div>
            </div>
        </>
    );
}
