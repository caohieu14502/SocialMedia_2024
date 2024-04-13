import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";

const Register = () => {
    const [user, setUser] = useState({ email: "", first_name: "", last_name: "", password: "", confirmPassword: "", username: "" });
	const [err, setErr] = useState(null);
	const [loading, setLoading] = useState(false);
	const avatar = useRef();
	const cover = useRef();
	const nav = useNavigate();
	const change = (e, field) => {
		setUser((current) => {
			return { ...current, [field]: e.target.value };
		});
	};

	const register = (e) => {
		e.preventDefault();

		const process = async () => {
			let form = new FormData();

			for (let field in user) if (field !== "confirmPassword") form.append(field, user[field]);
			form.append("avatar", avatar.current.files[0]); // kiem tra

			setLoading(true);
			let res = await Apis.post(endpoints["register"], form);
			if (res.status === 201) nav("/login");
			else setErr("Something went wrong! Please try again later.");
		};
		if (user.password === user.confirmPassword) process();
		else {
			setErr("Passwords DON'T match!!!");
		}
	};


    return(
        <>
            <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                {err === null ? (
					""
				) : (
					<div className='mb-4 rounded-lg bg-danger-100 px-6 py-5 text-base text-danger-700' role='alert'>
						{err}
					</div>
				)}
                <form className="card-body" onSubmit={register}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">First Name</span>
                        </label>
                        <input type="text" placeholder="First Name" className="input input-bordered" required value={user.first_name} onChange={(e) => change(e, "first_name")}/>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Last Name</span>
                        </label>
                        <input type="text" placeholder="Last Name" className="input input-bordered" required value={user.last_name} onChange={(e) => change(e, "last_name")}/>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Avatar</span>
                        </label>
                        <input type="file" placeholder="Avatar" className="input input-bordered" required ref={avatar}/>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Cover</span>
                        </label>
                        <input type="file" placeholder="Cover" className="input input-bordered" required ref={cover}/>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input type="text" placeholder="Username" className="input input-bordered" required value={user.username} onChange={(e) => change(e, "username")}/>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" placeholder="email" className="input input-bordered" required value={user.email} onChange={(e) => change(e, "email")}/>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" placeholder="password" className="input input-bordered" required value={user.password} onChange={(e) => change(e, "password")}/>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Confirm Password</span>
                        </label>
                        <input type="password" placeholder="Confirm password" className="input input-bordered" required value={user.confirmPassword} onChange={(e) => change(e, "confirmPassword")}/>
                    </div>
                    <div className="form-control mt-6">
                        {loading===true?<span className="loading loading-ring loading-md"></span>:<button className="btn btn-primary">Register</button>}
                    </div>
                </form>
                </div>
            </div>
            </div>
        </>
    )
}

export default Register