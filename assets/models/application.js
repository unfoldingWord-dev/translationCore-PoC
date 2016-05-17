(function (window, document) {

	applicationModel = {
		controllers: [
			'menu',
			'check',
      'figure',
      'target'
		],
    state: {
      language: undefined,
      reference: {
        book: undefined,
        chapter: undefined,
        chunk: undefined,
        verse: undefined
      }
    },
    aws_config: {
      user: "translationcore-user",
      accessKeyId: "AKIAJBE3KQMYGHXPTRHQ",
      secretAccessKey: "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",
      bucket: "translationcore"
    }
	};

}(this, this.document));