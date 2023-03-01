import { useState } from "react"
import { UrlFile } from "../../definitions/files"
import Track from "./components/Track";
import * as midiManager from 'midi-file';

interface Track {
    sound: UrlFile
    volume: number
    template: midiManager.MidiData
}

const Puzzle = () => {
    const [tracks, setTracks] = useState<Track[]>([])

    return (
        <div className="flex flex-col gap-1">
            <Track/>
            <Track/>
        </div>
    );
};

export default Puzzle;