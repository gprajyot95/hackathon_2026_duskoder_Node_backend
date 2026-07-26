export declare class PromptBuilderService {
    private cachedInstructionText;
    getSystemInstruction(): string;
    buildUserPrompt(schemaMetadata: string, userQuestion: string): string;
}
export declare const promptBuilderService: PromptBuilderService;
