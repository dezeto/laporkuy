export declare type MapJSON = {
  [key: string]: any;
};

export interface FaceSearchResponse {
  subject_id: string;
  similarity: number;
  image_b64: string;
}

export namespace FaceSearchResponse {
  export function fromJSON(json: MapJSON): FaceSearchResponse {
    return {
      subject_id: json.subject_id,
      similarity: json.similarity,
      image_b64: json.image_b64,
    };
  }
}

export interface SearchResult {
  id: string;
  name: string;
  similarity: number;
  image: string;
  postId: string;
}
