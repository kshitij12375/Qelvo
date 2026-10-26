import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import "../ui/LoginPage.css"
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const validateForm = () => {


        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm();

        if (success === true) login(formData);
    }

    const { login, isLoggingUp } = useAuthStore();


    return (
        <div className='box' >


            <h1>Welcome Back</h1>
            <p>Sign In to Your account </p>


            <form className='forms' onSubmit={handleSubmit}>



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


                <button className='sub-btn' type='submit' disabled={isLoggingUp}> {isLoggingUp ? (<><Loader2 /> Loading ...</>) : ("Sign In")} </button>
            </form>

            <div>
                <p>Don't have an account ? {" "} <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    )

}

export default LoginPage
