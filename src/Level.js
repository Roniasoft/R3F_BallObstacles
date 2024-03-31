import * as THREE from 'three'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({color: 'limegreen'})
const floor2Material = new THREE.MeshStandardMaterial({color: 'greenyellow'})
const obstacleMaterial = new THREE.MeshStandardMaterial({color: 'orangered'})
const wallMaterial = new THREE.MeshStandardMaterial({color: 'slategrey'})

export function BlockStart({ position = [ 0, 0, 0]}) 
{
    return <group position={ position }>
        {/* Floor */}
        <mesh 
            geometry={ boxGeometry } 
            position={[0, -0.1, 0]} 
            scale={[4, 0.2, 4]} 
            receiveShadow
            material={ floor1Material }
        />
    </group>
}

export function BlockEnd({ position = [ 0, 0, 0]}) 
{
    const hamburger = useGLTF('./hamburger.glb');
    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true;
    });

    return <group position={ position }>
        {/* Floor */}
        <mesh 
            geometry={ boxGeometry } 
            position={[0, 0, 0]} 
            scale={[4, 0.2, 4]} 
            receiveShadow
            material={ floor1Material }
        />
        <RigidBody type='fixed' colliders='hull' position={ [0, 0.25, 0] } restitution={0.2} friction={0}>
            <primitive object={hamburger.scene} scale={0.2} />
        </RigidBody>
    </group>
}

export function BlockSpinner({ position = [ 0, 0, 0]}) 
{
    const obstacle = useRef();
    const [ speed ] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1));

    useFrame((state, delta)=> {
        const time = state.clock.getElapsedTime();

        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
        obstacle.current.setNextKinematicRotation(rotation);
    })

    return <group position={ position }>
        {/* Floor */}
        <mesh 
            geometry={ boxGeometry } 
            position={[0, -0.1, 0]} 
            scale={[4, 0.2, 4]} 
            receiveShadow
            material={ floor2Material }
        />

        {/* Spinner Box(Obstacle) */}
        <RigidBody ref={ obstacle } type='kinematicPosition' position={[0, 0.3, 0]} restitution={ 0.2 } friction={ 0 }>
            <mesh 
                geometry={ boxGeometry } 
                material={ obstacleMaterial } 
                scale={ [3.5, 0.3, 0.3] } 
                receiveShadow
                castShadow
            />
        </RigidBody>
    </group>
}

export function BlockLimbo({ position = [ 0, 0, 0]}) 
{
    const obstacle = useRef();
    const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state, delta)=> {
        const time = state.clock.getElapsedTime();

        obstacle.current.setNextKinematicTranslation({x: position[0], y: Math.sin(time + timeOffset) * 1 + 1.15, z: position[2]});
    })

    return <group position={ position }>
        {/* Floor */}
        <mesh 
            geometry={ boxGeometry } 
            position={[0, -0.1, 0]} 
            scale={[4, 0.2, 4]} 
            receiveShadow
            material={ floor2Material }
        />

        {/* Spinner Box(Obstacle) */}
        <RigidBody ref={ obstacle } type='kinematicPosition' position={[0, 0.3, 0]} restitution={ 0.2 } friction={ 0 }>
            <mesh 
                geometry={ boxGeometry } 
                material={ obstacleMaterial } 
                scale={ [3.5, 0.3, 0.3] } 
                receiveShadow
                castShadow
            />
        </RigidBody>
    </group>
}

export function BlockAxe({ position = [ 0, 0, 0]}) 
{
    const obstacle = useRef();
    const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2);

    useFrame((state, delta)=> {
        const time = state.clock.getElapsedTime();

        obstacle.current.setNextKinematicTranslation({x: position[0] + Math.sin(time + timeOffset) * 1.25, y: position[1] + 0.75, z: position[2]});
    })

    return <group position={ position }>
        {/* Floor */}
        <mesh 
            geometry={ boxGeometry } 
            position={[0, -0.1, 0]} 
            scale={[4, 0.2, 4]} 
            receiveShadow
            material={ floor2Material }
        />

        {/* Spinner Box(Obstacle) */}
        <RigidBody ref={ obstacle } type='kinematicPosition' position={[0, 0.3, 0]} restitution={ 0.2 } friction={ 0 }>
            <mesh 
                geometry={ boxGeometry } 
                material={ obstacleMaterial } 
                scale={ [1.5, 1.5, 0.35] } 
                receiveShadow
                castShadow
            />
        </RigidBody>
    </group>
}

function Bounds({ length = 1 }) {
    return <>
    <RigidBody type='fixed' restitution={ 0.2 } friction={ 0 }>
        <mesh 
            geometry={ boxGeometry }
            scale={ [ 0.3 , 1.5, length * 4 ]}
            position={ [ 2.15, 0.75, -(2 * length) + 2 ] }
            material={wallMaterial}
            castShadow
        />
        <mesh 
            geometry={ boxGeometry }
            scale={ [ 0.3 , 1.5, length * 4 ]}
            position={ [ -2.15, 0.75, -(2 * length) + 2 ] }
            material={wallMaterial}
            receiveShadow
        />
        <mesh 
            geometry={ boxGeometry }
            scale={ [ 4.6 , 1.5, 0.3 ]}
            position={ [ 0, 0.75, -(4 * length) + 2] }
            material={wallMaterial}
            receiveShadow
        />
        <CuboidCollider 
            restitution={ 0.2 }
            friction={ 1 }
            args={[2, 0.1, 2 * length]}
            position={[0, -0.1, -(length * 2) + 2]}
        />
    </RigidBody>
    </>
}

export function Level({ count = 5, types = [ BlockSpinner, BlockAxe, BlockLimbo]})
{
    const blocks = useMemo(() => {
        const blocks = [];

        for (let i = 0; i < count; i++) {
            const element = types[Math.floor(Math.random() * types.length)];
            blocks.push(element);
        }

        return blocks;
    }, [count, types])

    return <>
        <BlockStart position={[0, 0, 0]} />

        { blocks.map((Block, index) => <Block key={ index } position={[ 0, 0, - (index + 1) * 4]} />) }

        <BlockEnd position={[0, 0, -(count + 1) * 4]} />

        <Bounds length={count + 2} />
    </>;
}