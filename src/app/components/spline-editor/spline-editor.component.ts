import { Component, OnInit } from '@angular/core';
import { MediaRecorder } from 'extendable-media-recorder';

@Component({
  selector: 'app-spline-editor',
  templateUrl: './spline-editor.component.html',
  styleUrls: ['./spline-editor.component.scss']
})
export class SplineEditorComponent implements OnInit {
  start = document.getElementById("start");
  stop = document.getElementById("stop");
  video = document.querySelector("video");
  recorder: any;
  stream: any;

  async startRecording() {
    const mediaDevices = navigator.mediaDevices as any;
    this.stream = await mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" }
    });

    this.recorder = new MediaRecorder(this.stream);

    const chunks = [];
    this.recorder.ondataavailable = e => chunks.push(e.data);
    this.recorder.onstop = e => {
      const completeBlob = new Blob(chunks, { type: chunks[0].type });
      this.video.src = URL.createObjectURL(completeBlob);
    };

    this.recorder.start();
  }


  constructor() { }

  ngOnInit(): void {


  }
  ngAfterViewInit() {
    this.start = document.getElementById("start");
    this.stop = document.getElementById("stop");
    this.video = document.querySelector("video");
    console.log(this.start);

    this.start.addEventListener("click", () => {
      this.start.setAttribute("disabled", "");
      this.stop.removeAttribute("disabled");

      this.startRecording();
    });

    this.stop.addEventListener("click", () => {
      this.stop.setAttribute("disabled", "");
      this.start.removeAttribute("disabled");

      this.recorder.stop();
      this.stream.getVideoTracks()[0].stop();
    });
  }


}
