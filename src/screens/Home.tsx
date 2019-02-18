import * as React from "react";
import ParticleComponent from "../components/ParticleComponent";
import * as Styles from "../styles/AppStyles";
import HeaderWithSpacer from "../components/HeaderWithSpacer";
import APIManager from "../managers/APIManager";

/**
 * Creates the state of the home page.
 */
interface IHomeState {
    animationFinished: boolean,
    codeIndex: number,
    intervalId: number,
    triggerIndex: number,
    nameString: string,
    mounted: boolean
}

/**
 * Defines the Home page seen in the browser.
 */
class Home extends React.Component<{}, IHomeState> {

    // Rate of animation.
    private static animationRate = 75;

    /**
     * This code is animated across the screen upon viewing the page.
     */
    private static animatedCode = [
        {code: "main:                                   # @main", trigger: false},
        {code: "# %bb.0:", trigger: false},
        {code: "        push    rbp", trigger: false},
        {code: "        mov     rbp, rsp", trigger: false},
        {code: "        sub     rsp, 48", trigger: false},
        {code: "        mov     eax, 10", trigger: false},
        {code: "        mov     ecx, eax", trigger: false},
        {code: "        mov     dword ptr [rbp - 4], 0", trigger: false},
        {code: "        mov     dword ptr [rbp - 8], edi", trigger: false},
        {code: "        mov     qword ptr [rbp - 16], rsi", trigger: false},
        {code: "        mov     dword ptr [rbp - 20], 10", trigger: true},
        {code: "        mov     rdi, rcx", trigger: false},
        {code: "        call    malloc                 # -- Allocate room for name", trigger: true},
        {code: "        mov     qword ptr [rbp - 32], rax", trigger: false},
        {code: "        mov     rsi, qword ptr [rbp - 32]", trigger: false},
        {code: "        mov     edx, offset .L.str", trigger: false},
        {code: "        mov     edi, edx", trigger: false},
        {code: "        call    strcpy                 # -- Copy over name to pool", trigger: true},
        {code: "        mov     rdi, qword ptr [rbp - 32]", trigger: false},
        {code: "        mov     qword ptr [rbp - 40], rax # 8-byte Spill", trigger: false},
        {code: "        mov     al, 0", trigger: false},
        {code: "        call    printf                 # -- Display", trigger: true},
        {code: "        ret", trigger: false},
        {code: ".L.str:", trigger: false},
        {code: "        .asciz  \"Jed Gentry\"", trigger: false},
        {code: "                                        # -- End Execution", trigger: false},
    ];

    constructor(props : {}) {
        super(props);
        this.state = {
            animationFinished: false,
            codeIndex: 0,
            intervalId: window.setInterval(this.animationTick, Home.animationRate),
            mounted: false,
            nameString: "",
            triggerIndex: 0,
        };
    }

    public async componentDidMount() {
        this.setState({mounted: true});
        // Update our API with the latest entries.
        await APIManager.getLatestEntries();
    }

    /**
     * Renders the page, first drawing the animation until completion.
     */
    public render() {
        const MAX_CODE = 15;
        const codeSlice =  Home.animatedCode.slice(this.state.codeIndex, Math.min(MAX_CODE, Home.animatedCode.length));
        const beforeAnimationColor = "#25ff3c";
        const afterAnimationColor = "#ffffff";
        return (
            <div>
                <HeaderWithSpacer/>
                <div style={{
                        backgroundColor: "black",
                        height: "100vh",
                        left: 0,
                        position: "absolute",
                        top: 0,
                        width: "100vw",
                        zIndex: -1
                    }}
                />
                <div >
                    {
                        this.state.animationFinished ? <ParticleComponent style={Styles.AppBackground}/> : null
                    }
                </div>
                <div style={{position: "relative"}}>
                    <div style={{
                            float: "left",
                            height: "calc(100%)",
                            position: "absolute",
                            top: 0,
                            width: "calc(20%)",
                            zIndex: 1
                    }}>
                        {
                           codeSlice.map((key, value) => (
                               <p key={value}
                                  style={{
                                      color: this.state.animationFinished ? afterAnimationColor : beforeAnimationColor,
                                      fontFamily: "Roboto",
                                      fontSize: "calc(10px + 6 * ((100vw - 320px) / 680)",
                                      textAlign: "left",
                                  }}
                               >
                                   {value === 0 ? "▷ " + key.code : key.code}
                               </p>
                           ))
                        }
                    </div>

                    <div style={{
                        height: "100%",
                        position: "absolute",
                        top: "30vh",
                        width: "100%",
                        zIndex: 1
                    }}>
                        <p
                            style={{
                            color: this.state.animationFinished ? afterAnimationColor : beforeAnimationColor,
                            fontFamily: "Roboto",
                            fontSize: "calc(40px + 6 * ((100vw - 320px) / 680)"
                        }}>
                            {this.state.nameString}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Updates one tick of the code animation.
     */
    private animationTick = () => {
        if(!this.state.mounted) {
            return;
        }

        let newNameString = "";
        switch (this.state.triggerIndex) {
            case 0:
                break;
            case 1:
                newNameString = "▯▯▯▯▯▯▯▯▯▯";
                break;
            default:
                newNameString = "Jed Gentry";
                break;
        }

        if(this.state.codeIndex === Home.animatedCode.length - 1) {
            clearInterval(this.state.intervalId);
        }

        let triggerIndex = this.state.triggerIndex;
        if(Home.animatedCode[this.state.codeIndex].trigger){
            triggerIndex++;
        }

        this.setState({
            animationFinished: this.state.codeIndex === Home.animatedCode.length - 1,
            codeIndex: this.state.codeIndex + 1,
            nameString: newNameString,
            triggerIndex
        });
    }
}

export default Home;
