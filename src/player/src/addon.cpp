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
    Isolate *isolate = args.GetIsolate();
    args.GetReturnValue().Set(String::NewFromUtf8(
                                  isolate, "hello world")
                                  .ToLocalChecked());
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
