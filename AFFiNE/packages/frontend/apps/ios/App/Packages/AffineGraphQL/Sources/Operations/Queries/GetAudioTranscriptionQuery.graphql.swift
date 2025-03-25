// @generated
// This file was automatically generated and should not be edited.

@_exported import ApolloAPI

public class GetAudioTranscriptionQuery: GraphQLQuery {
  public static let operationName: String = "getAudioTranscription"
  public static let operationDocument: ApolloAPI.OperationDocument = .init(
    definition: .init(
      #"query getAudioTranscription($workspaceId: String!, $jobId: String!) { currentUser { __typename copilot(workspaceId: $workspaceId) { __typename audioTranscription(jobId: $jobId) { __typename id status transcription { __typename speaker start end transcription } summary } } } }"#
    ))

  public var workspaceId: String
  public var jobId: String

  public init(
    workspaceId: String,
    jobId: String
  ) {
    self.workspaceId = workspaceId
    self.jobId = jobId
  }

  public var __variables: Variables? { [
    "workspaceId": workspaceId,
    "jobId": jobId
  ] }

  public struct Data: AffineGraphQL.SelectionSet {
    public let __data: DataDict
    public init(_dataDict: DataDict) { __data = _dataDict }

    public static var __parentType: any ApolloAPI.ParentType { AffineGraphQL.Objects.Query }
    public static var __selections: [ApolloAPI.Selection] { [
      .field("currentUser", CurrentUser?.self),
    ] }

    /// Get current user
    public var currentUser: CurrentUser? { __data["currentUser"] }

    /// CurrentUser
    ///
    /// Parent Type: `UserType`
    public struct CurrentUser: AffineGraphQL.SelectionSet {
      public let __data: DataDict
      public init(_dataDict: DataDict) { __data = _dataDict }

      public static var __parentType: any ApolloAPI.ParentType { AffineGraphQL.Objects.UserType }
      public static var __selections: [ApolloAPI.Selection] { [
        .field("__typename", String.self),
        .field("copilot", Copilot.self, arguments: ["workspaceId": .variable("workspaceId")]),
      ] }

      public var copilot: Copilot { __data["copilot"] }

      /// CurrentUser.Copilot
      ///
      /// Parent Type: `Copilot`
      public struct Copilot: AffineGraphQL.SelectionSet {
        public let __data: DataDict
        public init(_dataDict: DataDict) { __data = _dataDict }

        public static var __parentType: any ApolloAPI.ParentType { AffineGraphQL.Objects.Copilot }
        public static var __selections: [ApolloAPI.Selection] { [
          .field("__typename", String.self),
          .field("audioTranscription", [AudioTranscription].self, arguments: ["jobId": .variable("jobId")]),
        ] }

        public var audioTranscription: [AudioTranscription] { __data["audioTranscription"] }

        /// CurrentUser.Copilot.AudioTranscription
        ///
        /// Parent Type: `TranscriptionResultType`
        public struct AudioTranscription: AffineGraphQL.SelectionSet {
          public let __data: DataDict
          public init(_dataDict: DataDict) { __data = _dataDict }

          public static var __parentType: any ApolloAPI.ParentType { AffineGraphQL.Objects.TranscriptionResultType }
          public static var __selections: [ApolloAPI.Selection] { [
            .field("__typename", String.self),
            .field("id", AffineGraphQL.ID.self),
            .field("status", GraphQLEnum<AffineGraphQL.AiJobStatus>.self),
            .field("transcription", [Transcription]?.self),
            .field("summary", String?.self),
          ] }

          public var id: AffineGraphQL.ID { __data["id"] }
          public var status: GraphQLEnum<AffineGraphQL.AiJobStatus> { __data["status"] }
          public var transcription: [Transcription]? { __data["transcription"] }
          public var summary: String? { __data["summary"] }

          /// CurrentUser.Copilot.AudioTranscription.Transcription
          ///
          /// Parent Type: `TranscriptionItemType`
          public struct Transcription: AffineGraphQL.SelectionSet {
            public let __data: DataDict
            public init(_dataDict: DataDict) { __data = _dataDict }

            public static var __parentType: any ApolloAPI.ParentType { AffineGraphQL.Objects.TranscriptionItemType }
            public static var __selections: [ApolloAPI.Selection] { [
              .field("__typename", String.self),
              .field("speaker", String.self),
              .field("start", String.self),
              .field("end", String.self),
              .field("transcription", String.self),
            ] }

            public var speaker: String { __data["speaker"] }
            public var start: String { __data["start"] }
            public var end: String { __data["end"] }
            public var transcription: String { __data["transcription"] }
          }
        }
      }
    }
  }
}
