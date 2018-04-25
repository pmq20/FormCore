﻿using System;
using System.Net.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Results;

namespace FormCoreCSharp
{
  internal class GlobalExceptionHandler : ExceptionHandler {
    public override void Handle(ExceptionHandlerContext context) {
      var ex = context.ExceptionContext.Exception;
      if (ex is Error error) {
        var response = context.Request.CreateResponse(error.Code, new OFailure(error.Message, error.Data));
        context.Result = new ResponseMessageResult(response);
      } else {
        throw ex;
      }
    }
  }
}