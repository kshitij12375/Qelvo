import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import '../ui/SignUpPage.css'
import { Link } from 'react-router-dom';
import {toast} from 'react-hot-toast';


const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const validateForm = () => {

        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm();

        if (success === true) signup(formData);
    }

    const { signup, isSigningUp } = useAuthStore();


    return (
        <div className='box' >


            <h1>Create Account </h1>


            <form className='forms' onSubmit={handleSubmit}>
                <span>Full Name</span>
                <div className='el1'>

                    <input className='el2' type="text" placeholder='John Doe' value={formData.fullName} onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value })
                    }} />
                </div>

                <span>email</span>

                <div className='el1'>

                    <input className='el2' type="email" placeholder='John@gmail.com' value={formData.email} onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                    }} />
                </div>

                <span>Password</span>
                <div className='el1'>



                    <input className='el2' type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                    }} />

                    <button className='eye' type='button' onClick={() => { setShowPassword(!showPassword) }}>
                        {!showPassword ? (<EyeOff className='eyes' />) : (<Eye className='eyes' />)}

                    </button>





                </div>


                <button className='sub-btn' type='submit' disabled={isSigningUp}> {isSigningUp ? (<><Loader2 /> Loading ...</>) : ("Create Account")} </button>
            </form>

            <div>
                <p>Already have an account ? {" "} <Link to="/login">Sign in</Link></p>
            </div>
        </div>
    )
}

export default SignUpPage
