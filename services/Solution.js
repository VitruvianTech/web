import {ContactSolution} from '@vitruviantech/web/models/default';

export const create = async req => {
    const {email, solution} = req.body;

    return await ContactSolution.upsert({
      ContactEmail: email,
      SolutionId: solution.id,
      summary: solution.summary
    });
};
