using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormCore.Models {
  public static class ModelExtension {

    public static void Set(this Dictionary<int, int> dic, int key, int value) {
      if (dic.ContainsKey(key)) {
        dic[key] = value;
      } else {
        dic.Add(key, value);
      }
    }

    public static Dictionary<int, int> GetSectionMergeMappingDic(this List<Section> sections) {
      var dic = new Dictionary<int, int>();
      sections.ForEach(x => {
        if (x.SectionMergeMapping != null) {
          foreach (var keyValuePair in x.SectionMergeMapping)
          {
            dic.Set(keyValuePair.Key,keyValuePair.Value);
          }
        }
      });
      return dic;
    }


  }
}
