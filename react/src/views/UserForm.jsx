import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function UserForm() {
    const navigate = useNavigate()
    const {id} = useParams()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const {setNotification} = useStateContext()
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    const onSubmit = (e) => {
        // debugger
        e.preventDefault()
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User was successfully updated')
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post('/users', user)
                .then(({data}) => {
                    setNotification('User was successfully created')
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    }

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`users/${id}`)
                .then(({data}) => {
                    setLoading(false)
                    setUser(data)
                    console.log(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }


    return (
        <div>
            {user.id && <h1>Update User:{user.name}</h1>}
            {!user.id && <h1>New User</h1>}
            {
                loading && (<div className="card animated fadeInDown">
                        <div className="text-center">Loading...</div>
                    </div>
                )
            }
            {errors &&
                <div className="alert">
                    {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>
            }
            {!loading &&
                <form onSubmit={onSubmit}>
                    <input onChange={ev => setUser({...user, name: ev.target.value})} value={user.name} type="text"
                           placeholder="Full Name"/>
                    <input type="email" onChange={ev => setUser({...user, email: ev.target.value})} value={user.email}
                           type="email"
                           placeholder="Email Address"/>
                    <input type="password" onChange={ev => setUser({...user, password: ev.target.value})}
                           type="password"
                           placeholder="Password"/>
                    <input type="password" onChange={ev => setUser({...user, password_confirmation: ev.target.value})}
                           type="password"
                           placeholder="Repeat Password"/>
                    <button className="btn">Save</button>
                </form>

            }
        </div>
    )
}
