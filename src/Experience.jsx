import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level, BlockAxe, BlockLimbo, BlockStart, BlockEnd, BlockSpinner } from './Level.js'
import { Physics } from '@react-three/rapier'
import Player from './Player.js'

export default function Experience()
{
    return <>

        <OrbitControls makeDefault />


        <Physics debug>
            <Lights />
            <Level />
            <Player />
        </Physics>



    </>
}