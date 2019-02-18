import * as React from 'react';
import Module from './wasm/gearboy.js';
import 'react-popper-tooltip/dist/styles.css';

/**
 * State used to track whether or not the video has played.
 */
interface IGameboyColorState {
    playIntro: boolean
}

class GameboyColor extends React.Component<{}, IGameboyColorState> {

    // This is our WASM module.
    private module: any;

    constructor(props :{}) {
        super(props);
        this.state = {
            playIntro: true
        };
        // TODO: Polyfill the Module.load_from_source function with the following:
        // TODO: function locateFile(path){return "https://s3-us-west-2.amazonaws.com/jedgentry.com/emulators/wasm/gearboy.wasm";
        // TODO: See gearboy.js for the rest.
    }

    /**
     * Ensures that the WASM module has the right reference to the HTML object.
     */
    public componentDidMount() {
        this.module = Module();
        this.module.canvas = document.getElementById("canvas");
        this.module.run();
    }

    // TODO: Canvas or the script needs a key that persists as long as the user is on the page.
    // TODO: If the user changes to a different page the next time they come back the key needs to change.
    public render() {
        return (
            <div>
                <canvas
                    id={"canvas"}
                    style={{width: 160, height: 140}}
                />
                <div>
                    {"D-Pad: ↑↓←→\nA: A\nB: S"}
                </div>
                <form id="myform">
                    <input
                        id="rom-file-loaded"
                        type="file"
                        onChange={this.handleFile}
                    />
                </form>
            </div>
        );
    }

    /**
     * This handles a file change event when the user selects to load a rom.
     * @param event The event that was fired from the <Input> element.
     */
    private handleFile = (event :React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target!.files![0];
        if(file === null) {
            return;
        }

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            if(fileReader.result != null) {
                // @ts-ignore
                this.loadRom(fileReader.result);
            }
        };

        fileReader.readAsArrayBuffer(file);
    };

    /**
     * This loads a rom into the WASM executable.
     * @param data The rom as a 1D array of bytes.
     */
    private loadRom = (data: ArrayBuffer) => {
        const contiguousRomData = new Uint8Array(data);
        this.module.FS_createDataFile('/', 'current_rom.gbc', contiguousRomData, true, true, true);
        this.module.ccall('load_rom', null, [], null);
    };
}

export default GameboyColor;
