import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
    return (
        <main>
            <Header />
            <div className="mx-auto max-w-6xl px-6 py-12">
                <h1 className="mb-6 text-3xl font-bold">Quiénes somos</h1>
                <p className="mb-4 text-lg leading-relaxed">
                    El Observatorio es un proyecto de investigación y análisis de datos que tiene como objetivo principal recopilar, procesar y presentar información relevante sobre la situación del sector educativo en México. 
                </p>
            </div>
        </main>
    )
}