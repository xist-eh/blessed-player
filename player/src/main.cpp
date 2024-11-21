#include <cstdio>
#include "SDL.h"
#include "SDL_mixer.h"

#include <chrono>
#include <thread>


static const char *MY_COOL_MP3 = "D:\\Dev\\blessed-player\\test-music\\bound2.m4a";

int main(int argc, char **argv) {
    int result = 0;
    int flags = MIX_INIT_MP3;

    if (SDL_Init(SDL_INIT_AUDIO) < 0) {
        printf("Failed to init SDL\n");
        exit(1);
    }

    if (flags != (result = Mix_Init(flags))) {
        printf("Could not initialize mixer (result: %d).\n", result);
        printf("Mix_Init: %s\n", Mix_GetError());
        exit(1);
    }

    printf("About to play MP3...");

    Mix_OpenAudio(22050, AUDIO_S16SYS, 2, 640);
    Mix_Music *music = Mix_LoadMUS(MY_COOL_MP3);
    Mix_PlayMusic(music, 1);

    printf("Playing MP3 \n");

    std::this_thread::sleep_for(std::chrono::milliseconds(2500));

    Mix_SetMusicPosition(100);

    while (!SDL_QuitRequested()) {
        SDL_Delay(250);
    }

    Mix_FreeMusic(music);
    SDL_Quit();
    return 0;
}