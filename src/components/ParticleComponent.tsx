import * as React from 'react';
import {IParticlesParams} from "react-particles-js";
import * as Particle from "react-particles-js";

/**
 * Describes the interface for creating a ParticleComponent.
 */
const ParticleParam: IParticlesParams = {
    particles: {
        line_linked: {
            opacity: 0.25,
            width: 2
        },
        number: {
            value: 50
        },
        opacity: {
            value: 0.25
        },
        size: {
            value: 3
        }
    },
};

/**
 * Returns a canvas with a particle element in it.
 * @param style The style to display the particles as.
 * @constructor
 */
const ParticleComponent: React.FunctionComponent<{style?: any}> = ({style}) => {
    return (
        <Particle.default
            params={ParticleParam}
            style={style}
        />
    );
};

export default ParticleComponent;
