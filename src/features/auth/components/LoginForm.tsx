import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '../schemas'
import { useAuthStore } from '../store/store.ts'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema)
    })
    const login = useAuthStore(state => state.login)
    const navigate = useNavigate()

    const onSubmit = async (data: LoginInput) => {
        try {
            await login(data.email, data.password)
            navigate('/')
        } catch (err) {
            alert('Error al iniciar sesión')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('email')} placeholder="Correo" autoComplete="username" />
            <p>{errors.email?.message}</p>

            <input {...register('password')} placeholder="Contraseña" type="password" autoComplete="current-password" />
            <p>{errors.password?.message}</p>

            <button type="submit">Iniciar sesión</button>
        </form>
    )
}

export default LoginForm;
