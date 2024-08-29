import { Howl } from "howler";

export default function SoundNotify({ type }) {
  const soundsLib = {
    gift: "gift.wav",
    like: "chat.wav",
    comment: "chat.wav",
    viewer: "chat.wav",
  };
  var sound = new Howl({
    src: "/assets/sounds/" + soundsLib[type],
    html5: true,
    volume: 0.2,
  });
  sound.play();
}
