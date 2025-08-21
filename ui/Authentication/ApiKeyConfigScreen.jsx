import {
    Button,
    Form,
    FormHeader,
    FormFooter,
    FormSection,
    HelperMessage,
    Label,
    RequiredAsterisk,
    Text,
    Textfield, useForm
} from "@forge/react";
import React from "react";
import {invoke} from "@forge/bridge";

const TokenForm = ({onSet}) => {

    const { handleSubmit, register, getFieldId } = useForm();

    const saveToken = async ({token}) => {
        // handle data inputs
        await invoke('setGithubToken', {token});
        onSet(token);
    };

    return (
        <>
            <Text>Enter your GitHub Personal Access Token:</Text>
            <Form onSubmit={handleSubmit(saveToken)}>
                <FormHeader title="GitHub Token">
                    Required fields are marked with an asterisk <RequiredAsterisk/>
                </FormHeader>
                <FormSection>
                    <Label labelFor={getFieldId("token")}>
                        GitHub Token
                        <RequiredAsterisk/>
                    </Label>
                    <Textfield type="password" {...register("token", {required: true })} />
                    <HelperMessage>
                        Please provide a valid github token used to access your repositories.
                    </HelperMessage>
                </FormSection>
                <FormFooter>
                    <Button appearance="primary" type="submit">
                        Submit
                    </Button>
                    <Text>Your token is stored securely and never exposed in the UI.</Text>
                </FormFooter>
            </Form>

        </>
    );
}

export default TokenForm;