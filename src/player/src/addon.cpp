
#include "../lib/include/SDL.h"
#include "../lib/include/SDL_mixer.h"

// addon.cc
#include <node.h>

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void MyFunction(const FunctionCallbackInfo<Value> &args)
{
    // Isolate *isolate = args.GetIsolate();

    static const char *MY_COOL_MP3 = "D:/Dev/blessed-player/test-music/bound2.m4a";

    int result = 0;
    int flags = MIX_INIT_MP3;

    if (SDL_Init(SDL_INIT_AUDIO) < 0)
    {
        printf("Failed to init SDL\n");
        exit(1);
    }

    if (flags != (result = Mix_Init(flags)))
    {
        printf("Could not initialize mixer (result: %d).\n", result);
        printf("Mix_Init: %s\n", Mix_GetError());
        exit(1);
    }

    printf("About to play MP3...");

    Mix_OpenAudio(22050, AUDIO_S16SYS, 2, 640);
    Mix_Music *music = Mix_LoadMUS(MY_COOL_MP3);
    Mix_PlayMusic(music, 1);

    printf("Playing MP3 \n");

    Mix_SetMusicPosition(100);

    while (!SDL_QuitRequested())
    {
        SDL_Delay(250);
    }

    Mix_FreeMusic(music);
    SDL_Quit();
}

void CreatePlayerObject(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, MyFunction);
    Local<Function> fn = tpl->GetFunction(context).ToLocalChecked();

    Local<Object> obj = Object::New(isolate);
    obj->Set(context, String::NewFromUtf8(isolate, "msg").ToLocalChecked(), args[0]->ToString(context).ToLocalChecked()).FromJust();

    obj->Set(context, String::NewFromUtf8(isolate, "myFunction").ToLocalChecked(), fn);

    args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module)
{
    NODE_SET_METHOD(module, "exports", CreatePlayerObject);
}

NODE_MODULE(mixplayer, Init)
