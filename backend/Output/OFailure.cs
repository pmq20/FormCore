﻿using System.Collections;

namespace FormCoreCSharp
{
  public class OFailure {
    public OFailure(string errMsg = null, IDictionary data = null) {
      ErrMsg = errMsg;
      Data = data;
    }
    
    public string ErrMsg { get; set; }
    public IDictionary Data { get; set; }
  }
}