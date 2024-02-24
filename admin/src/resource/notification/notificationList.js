import {Datagrid, DeleteButton, EditButton, FunctionField, TextField, useTranslate,} from 'react-admin';
import {dateFormat} from '@/functions';

import {useMediaQuery} from '@mui/material';
import {List, SimpleForm} from '@/components';

export const notificationList = (props) => {
    const translate = useTranslate();
    const isSmall = useMediaQuery(
        theme => theme.breakpoints.down('768'),
        {noSsr: true}
    );
    return (
        <List {...props}>
            {isSmall ? (
                    <Datagrid
                        optimized
                        bulkActionButtons={false}
                        // rowStyle={postRowStyle}
                    >

                        <FunctionField
                            label={translate('resources.notification.actions')}
                            render={(record) => (
                                <>
                                    <div>
                                        <TextField
                                            source="title"
                                            label={translate('resources.notification.title')}
                                        />
                                    </div>
                                    <div>
                                        <div>
                                            <TextField
                                                source="message"
                                                label={translate('resources.notification.message')}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                source="status"
                                                label={translate('resources.notification.status')}
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                source="phone"
                                                label={translate('resources.notification.phone')}
                                            />
                                        </div>
                                    </div>
                                    <div className="theDate">
                                        <div>
                                            {translate('resources.page.createdAt') +
                                            ': ' +
                                            `${dateFormat(record.createdAt)}`}
                                        </div>
                                        <div>
                                            {translate('resources.page.updatedAt') +
                                            ': ' +
                                            `${dateFormat(record.updatedAt)}`}
                                        </div>

                                    </div>

                                    <div>
                                        <EditButton/>
                                    </div>
                                </>
                            )}/>
                    </Datagrid>) :
                (<Datagrid>
                    <TextField
                        source="title"
                        label={translate('resources.notification.title')}
                    />
                    <TextField
                        source="message"
                        label={translate('resources.notification.message')}
                    />
                    <TextField
                        source="status"
                        label={translate('resources.notification.status')}
                    />
                    <TextField
                        source="phone"
                        label={translate('resources.notification.phone')}
                    />
                    <FunctionField
                        label="resources.notification.date"
                        render={(record) => {
                            return (
                                <div className="theDate">
                                    <div>
                                        {translate('resources.notification.createdAt')}:
                                        <span dir="ltr"> {dateFormat(record.createdAt)}</span>
                                    </div>
                                    <div>
                                        {translate('resources.notification.updatedAt')}:
                                        <span dir="ltr"> {dateFormat(record.updatedAt)}</span>
                                    </div>

                                </div>
                            );
                        }}
                    />
                    <FunctionField
                        label="resources.notification.actions"
                        render={(record) => {
                            return (
                                <div className="actions">
                                    <div>
                                        <EditButton/>
                                    </div>
                                    <div>
                                        <DeleteButton/>
                                    </div>

                                </div>
                            );
                        }}
                    />


                </Datagrid>)}
        </List>
    );
};

export default notificationList;
