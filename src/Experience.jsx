import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level, BlockAxe, BlockLimbo, BlockStart, BlockEnd, BlockSpinner } from './Level.js'
import { Physics } from '@react-three/rapier'
import Player from './Player.js'
import { Perf } from 'r3f-perf'

export default function Experience()
{
    return <>
        <Perf position="top-left" />
        <OrbitControls makeDefault />


        <Physics debug>
            <Lights />
            <Level />
            <Player />
        </Physics>



    </>
}